class Chat {
    constructor(el, addr) {
        this.el = $(el)
        this.Io = io.connect(addr)
        this.init()
    }

    init() {
        this.Io.on("bordercaseJoin", (users) => {
            new LoginForm(this.el, JSON.parse(users), this.Io).init()
        })
    }
}

class LoginForm {
    constructor(el, allUsers, Io) {
        this.AllUsers = allUsers
        this.FocusUser = null
        this.el = el
        this.Io = Io
    }

    renderUsers = (AllUsers) => {
        this.showUsers(AllUsers)
        this.el.find('li').off('click').on('click', e => {
            this.onFocusUser(Number(e.target.getAttribute('userID')))
        })
    }

    virtualUserIcon = (id, name, Icon, description) => {
        return `<li>
                    <img src="${Icon}" alt="${description}" userID=${id} title="${description}" >
                    <p>${name}</p>
                </li>`
    }

    virtualRoot = () => {
        return `<div class="loginForm" id="loginForm">
                    <div class="userNameInpt">
                        <input type="text" placeholder="please type a name...">
                    </div>
                    <div class="userIcon">
                        <ul>
                        </ul>
                    </div>
                    <div>
                        <button class="loginBtn">登陆</button>
                        <button class="registerBtn">添加</button>
                        <button class="allUserBtn">所有用户</button>
                    </div>
                </div>
            `
    }

    showUsers = (Users) => {
        let html = ``
        Users.forEach(el => {
            html += this.virtualUserIcon(el.id, el.name, el.Icon, el.description)
        })
        this.el.find('ul').html(html)
    }

    onFocusUser = (signal) => {
        if (typeof signal === "string") {
            if (this.seleteUserByName(signal).length > 0) {
                this.FocusUser = this.seleteUserByName(signal)[0]
                this.renderUsers(this.seleteUserByName(signal))
            } else {
                this.renderUsers(this.AllUsers)
            }
        } else if (typeof signal === "number") {
            this.FocusUser = this.seleteUserById(signal)[0]
            this.renderUsers(this.seleteUserById(signal))
        }
    }

    seleteUserByName = (name) => {
        let user = this.AllUsers.filter(el => {
            return el.name === name
        })
        return user
    }

    seleteUserById = (id) => {
        let user = this.AllUsers.filter(el => {
            return el.id === id
        })
        return user
    }

    login = (user) => {
        if (user != null) {
            this.Io.emit("login", user)
            this.Io.on("bordercaseLogin", (data) => {
                this.FocusUser = data
            })
            if (this.FocusUser != null) {
                this.destory()
                new MainForm(this.el, this.FocusUser, this.Io)
            }

        } else {
            alert("please chose a user");
        }
    }

    destory = () => {
        this.el.empty()
    }

    Bind = () => {
        this.renderUsers(this.AllUsers)
        this.el.find('input').off('input propertychange').on('input propertychange', e => {
            this.onFocusUser($(e.target).val())
        })

        this.el.find('.loginBtn').off('click').on('click', () => {
            this.login(this.FocusUser)
        })

        this.el.find('.registerBtn').off('click').on('click', () => {
            this.destory()
            new RegisterForm(this.el, this.AllUsers, this.Io)
        })

        this.el.find('.allUserBtn').off('click').on('click', () => {
            this.FocusUser = null
            this.el.find('input').val('')
            this.el.find('ul').empty()
            this.renderUsers(this.AllUsers)
        })
    }

    init = () => {
        this.el.html(this.virtualRoot())
        this.Bind()
    }
}


class MainForm {
    constructor(el, user, Io) {
        this.el = el
        this.user = user
        this.Io = Io
        this.usersCount = 1
        this.init()
    }

    destory = () => {
        this.el.empty()
        this.Io.emit("disconnect", this.user)
    }

    Bind = () => {
        this.el.find('.controlBtnMsg').off('click').on('click', () => {
            let message = this.el.find('.inputBox>textarea').val()
            this.el.find('.inputBox>textarea').val("")
            this.scrollBottom()
            if (message) {
                let data = {
                    message,
                    "user": this.user
                }
                this.Io.emit("bordercaseMessage", data)
                this.el.find('.messageBoxT').append(this.virtualOutputSelf(this.user, message))
            } else {
                $.error("please enter message")
            }
        })

        this.el.find('.controlBtnPic').off('click').on('click', () => {
            console.log(1)
        })

        this.el.find('.close').off('click').on('click', () => {
            new Chat("#App", 'localhost:3333')
            this.destory()
        })
    }
    virtualUserItem = (Icon, name, role) => {
        return `
            <li>
                <img src="${Icon}">
                <div>
                    <p>${name}</p>
                    <p>role:${role}</p>
                </div>
            </li>
            `
    }
    virtualBordercast = (name, msg) => {
        return `
            <div class="bordercaseOutput">
                <p>${name} ${msg}</p>
            </div>
        `
    }

    virtualTitle = (number) => {
        return `<p>Chat(<span>${number}</span>人)</p>`
    }

    virtualOutputSelf = (user, message) => {
        return `
        <ul class="selfOutput">
            <li>
                <p>${message}</p>
                <img src="${user.Icon}">
            </li>
        </ul>
        `
    }

    virtualOutputOther = (user, message) => {
        return `
        <ul class="otherOutput">
            <li>
                <img src="${user.Icon}">
                <p>${message}</p>
            </li>
        </ul>
        `
    }

    virtualRoot = () => {
        return `<div class="userClient" id="userClient">
                    <div class="clientTitle">
                        <div class="clientTitleNumber"></div>
                        <div class="close">
                            <p>x</p>
                        </div>
                    </div>
                    <div class="mainBottom">
                        <div class="userList">
                            <ul></ul>
                        </div>
                        <div class="messageBox">
                            <div class="outputBox">
                                <div class="messageBoxT"></div>
                            </div>
                            <div class="inputBox">
                                <div class="controlBtn">
                                    <button class="controlBtnPic">图片</button>
                                    <button class="controlBtnMsg">发送</button>
                                </div>
                                <textarea placeholder="输入消息"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            `
    }

    renderUser = () => {
        this.el.find('.userList>ul').html(this.virtualUserItem(this.user.Icon, this.user.name, "myself"))
    }

    scrollBottom = () => {
        let lastItem = $('.messageBoxT')[0].lastElementChild
        if (lastItem != null) {
            lastItem.scrollIntoView(false)
            $(lastItem).css("marginBottom", 0)
        }
    }

    uploadVideo = async (oUploader) => {
        
    }

    init = () => {
        this.el.html(this.virtualRoot())
        this.Io.on('getUsers', (result) => {
            this.usersCount = result.length
            this.el.find('.clientTitleNumber').html(this.virtualTitle(this.usersCount))
            result.forEach((el) => {
                this.el.find('.userList>ul').append(this.virtualUserItem(el.Icon, el.name, "other"))
            })
        })
        this.Io.on('bordercaseMessage', (result) => {
            if (result.user.id !== this.user.id) {
                this.el.find('.messageBoxT').append(this.virtualOutputOther(result.user, result.message))
            }
        })
        this.Io.on('bordercaseLogin', (result) => {
            this.el.find('.messageBoxT').append(this.virtualBordercast(result.name, "join the conversation"))
            this.el.find('.userList>ul').append(this.virtualUserItem(result.Icon, result.name, "other"))
            this.el.find('.clientTitleNumber').html(this.virtualTitle(this.usersCount + 1))
        })
        this.Io.on('bordercaseExit', (result) => {
            this.el.find('.messageBoxT').append(this.virtualBordercast(result.name, "has been disconnect the conversation"))
            this.el.find('.userList>ul')
            this.el.find('.clientTitleNumber').html(this.virtualTitle(this.usersCount - 1))
        })

        this.Io.on('newUserList', (result) => {
            this.el.find('.userList>ul').empty()
            result.forEach((el) => {
                this.el.find('.userList>ul').append(this.virtualUserItem(el.Icon, el.name, "other"))
            })
            this.el.find('.clientTitleNumber').html(this.virtualTitle(this.usersCount - 1))
        })
        this.renderUser()
        this.Bind()
    }
}



class RegisterForm {
    constructor(el, allUsers, Io) {
        this.el = el
        this.Io = Io
        this.allUsers = allUsers
        this.init()
    }

    virtualRoot = () => {
        return `<div class="registerForm" id="registerForm">
                    <div class="userInpt">
                        <p>userName:</p>
                        <div class="userNameInpt">
                            <input type="text" placeholder="please type a name...">
                        </div>
                        <p>userPassword:</p>
                        <div class="userPasswordInpt">
                            <input type="password" placeholder="please type a password...">
                        </div>
                        <p>Description:</p>
                        <div class="userDescriptionInpt">
                            <input type="description" placeholder="please type a description...">
                        </div>
                        <p>Icon:</p>
                        <div class="userIconInpt">
                            <input type="file" name="file" accept="image/*">
                        </div>
                    </div>
                    <div>
                        <button class="addUser">添加</button>
                        <button class="comeback">返回登陆</button>
                    </div>
                </div>`
    }

    destory = () => {
        $(this.el).empty()
    }

    Bind = () => {
        $(this.el).find('.userNameInpt>input').off('input propertychange').on('input propertychange', (e) => {
            $(e.target).val()
        })

        $(this.el).find('.userPasswordInpt>input').off('input propertychange').on('input propertychange', (e) => {
            $(e.target).val()
        })

        $(this.el).find('.userDescriptionInpt>input').off('input propertychange').on('input propertychange', (e) => {
            $(e.target).val()
        })

        $(this.el).find('.userIconInpt>input').off('change').on('change', (e) => {
            let files = e.target
        })

        $(this.el).find('.addUser').off('click').on('click', () => {

        })

        $(this.el).find('.comeback').off('click').on('click', () => {
            this.destory()
            new LoginForm(this.el, this.allUsers, this.Io)
        })
    }
    
    init = () => {
        $(this.el).html(this.virtualRoot())
        this.Bind()
    }
}

new Chat("#App", "localhost:3333").init()
