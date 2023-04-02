class Server {
    constructor(port, IOoptions, DATAoptioons) {
        this.port = port
        this.app = require('express')()
        this.server = require('http').Server(this.app)
        this.io = require('socket.io')(this.server, IOoptions)
        this.moment = require('moment')
        this.mysql = require('mysql')
        this.userList = []
        this.mysqlConn = this.mysql.createPool(DATAoptioons)
    }

    dataAccessQuery = (sql, callback) => {
        this.mysqlConn.getConnection((_err, connection) => {
            if (_err) {
                console.log(_err);
            } else {
                connection.query(sql, (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        callback(JSON.stringify(results))
                    }
                })
                connection.release()
            }
        })
    }

    login = (socket, result) => {
        let user = {
            name: result.name,
            Icon: result.Icon,
            id: result.id
        }
        let index = this.userList.findIndex(item => item.id === user.id)
        if (index === -1) {
            socket.user = user
            this.userList.push(user)
            return -1
        } else {
            return 0
        }
    }

    date = () => {
        return this.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }

    init = () => {
        this.server.listen(this.port, () => {
            this.app.use(require('express').static('public'))
            this.app.get('/', (req, res) => {
                res.redirect('dist/index.html')
            })
            this.io.on("connection", (socket) => {
                console.log("a client has been connected")
                this.dataAccessQuery(`select * from user;`, (data) => {
                    this.io.emit("broadcastJoin", data)
                    socket.on("login", (result) => {
                        let isLogin = this.login(socket, result)
                        if (isLogin === -1) {
                            this.io.emit("broadcastLogin", { user: socket.user, action: "join", date: this.date() })
                            this.io.emit('newUserList', this.userList)
                            console.log("user:" + result.name + " has been login")
                            socket.on("broadcastMessage", (result) => {
                                result.date = this.date()
                                console.log(result.date + "" + result.user.name + " say:" + result.message)
                                this.io.emit("broadcastMessage", result)
                            })
                            socket.on("broadcastImage", (result) => {
                                result.date = this.date()
                                console.log(result.date + "" + result.user.name + " say:" + result.message)
                                this.io.emit("broadcastImage", result)
                            })
                            socket.on("userExit", () => {
                                let index = this.userList.findIndex(item => item.id === socket.user.id)
                                this.userList.splice(index, 1)
                                this.io.emit('newUserList', this.userList)
                                let result = {}
                                result.user = socket.user
                                result.date = this.date
                                result.action = "leave"
                                this.io.emit("broadcastExit", result)
                                console.log(socket.user.name + " has been disconnected")
                            })
                            socket.on("disconnect", () => {
                                let index = this.userList.findIndex(item => item.id === socket.user.id)
                                this.userList.splice(index, 1)
                                this.io.emit('newUserList', this.userList)
                                let result = {}
                                result.user = socket.user
                                result.date = this.date
                                result.action = "leave"
                                this.io.emit("broadcastExit", result)
                                console.log(socket.user.name + " has been disconnected")
                            })
                        } else {
                            this.io.emit("broadcastLogin", { user: null, action: "join", date: this.date() })
                            socket.on("disconnect", () => {
                                console.log("a client has been disconnected")
                            })
                        }
                    })
                })
            })
            console.log('server started in ' + this.port)
        })
    }
}


const IOoptions = {
    allowEIO3: true,
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    }
}

const DATAoptioons = {
    connectionLimit: 15,
    host: 'localhost',
    user: 'root',
    password: '9091',
    database: 'chat'
}

new Server(3333, IOoptions, DATAoptioons).init()
