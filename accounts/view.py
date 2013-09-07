# coding=utf-8
from flask import Blueprint, render_template
from flask.ext.login import login_user, logout_user
from flask.ext.wtf.form import Form
from flask.globals import request
from wtforms.fields.core import BooleanField
from wtforms import TextField, PasswordField, validators
from models.user import User
from utils.database_session import session_cm

accounts = Blueprint('accounts', __name__,
                     template_folder='templates')


@accounts.route('/login', methods=['POST'])
def login():
    template_var = {}
    form = LoginForm(request.form)
    if request.method == 'POST' and form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        remember = form.remember.data
        user = User.validate_user(email, password)
        if user is not None:
            login_user(user, remember)
            return render_template('todos/index.html')
    template_var["form"] = form
    return render_template("accounts/login.html", **template_var)


@accounts.route('/reg', methods=['GET', 'POST'])
def register():
    """
    注册一个新的用户
    """
    template_var = {}
    form = RegisterForm()
    if request.method == "POST" and form.validate():
        form = RegisterForm(request.form)
        with session_cm() as session:
            user = User()
            user.username = form.username.data
            user.nickname = form.nickname.data
            user.email = form.email.data
            user.set_password(form.password.data)
            session.add(user)
            if user is not None:
                login_user(user)
                template_var['user'] = user
            session.commit()
            return render_template('todos/index.html', **template_var)
    template_var['form'] = form
    return render_template('accounts/register.html', **template_var)

@accounts.route('/logout')
def logout():
    """
    注销用户
    """
    logout_user()
    return render_template('todos/index.html')


class LoginForm(Form):
    email = TextField(u'邮箱', [validators.Required(message=u"登录邮箱不能为空")])
    password = PasswordField(u'密码', [validators.Required(message=u"密码不能为空")])
    remember = BooleanField(u'记住密码')


class RegisterForm(Form):

    email = TextField(u'邮箱', [validators.Required(message=u"邮箱不能为空")])
    username = TextField(u'用户名',
                         [validators.Required(message=u"用户名不能为空"),
                          validators.length(max=16, message=u'用户名太长了，最长16个字符')])
    nickname = TextField(u'昵称',
                         [validators.Required(message=u"每个响亮的昵称怎么混？"),
                          validators.length(max=10, message=u'要有咱也不能太长呀，最长10个字符')])
    password = PasswordField(u'密码',
                             [validators.Required(message=u"密码不能为空"),
                              validators.length(max=16, message=u'要有咱也不能太长呀，最长16个字符')])
    password_confirm = PasswordField(u'密码确认',
                                     [validators.Required(message=u"请再次输入密码"),
                                      validators.equal_to('password', message=u'两次输入的密码必须要一致')])