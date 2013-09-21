# coding=utf-8
from flask import Blueprint, render_template, jsonify
from flask.ext.login import login_user, logout_user
from flask.ext.principal import identity_changed, Identity
from flask.ext.wtf.form import Form
from flask.globals import request, current_app
from wtforms.fields.core import BooleanField
from wtforms import TextField, PasswordField, validators
from models.user import User
from utils.database_session import session_cm
from utils.response import ajax_response

account = Blueprint('views', __name__, template_folder='templates')


@account.route('/passionate_users')
def passionate_users():
    res = ajax_response()
    with session_cm() as session:
        user_list = session.query(User).all()
        user_dict_list = []
        for user in user_list:
            user_dict_list.append(user.to_dict())
        res.update(data={
            "items": user_dict_list
        })
    return jsonify(res)


@account.route('/ajax_login', methods=['POST'])
def ajax_login():
    res = ajax_response()
    email = request.form.get("email")
    password = request.form.get("password")
    remember = True if request.form.get("remember") else False
    user, validate_user_errors = User.validate_user(email, password)
    if user:
        login_user(user, remember)
        # Tell Flask-Principal the identity changed
        identity_changed.send(current_app._get_current_object(), identity=Identity(user.user_id))
        res.update(data={
            'user': user.to_dict()
        })
    else:
        res.update({
            'response': 'fail',
            'type': 'error',
            'info': validate_user_errors['user_error'] or validate_user_errors['password_error']
        })
    return jsonify(res)



@account.route('/login', methods=['POST'])
def login():
    template_var = {}
    validate_user_errors = None
    form = LoginForm(request.form)
    if request.method == 'POST' and form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        remember = form.remember.data
        user, validate_user_errors = User.validate_user(email, password)
        if user is not None:
            login_user(user, remember)
            # Tell Flask-Principal the identity changed
            identity_changed.send(current_app._get_current_object(), identity=Identity(user.user_id))
            template_var['owner'] = user
            return render_template('index.html', **template_var)
    template_var.update({
        'form': form,
        'validate_user_errors': validate_user_errors
    })
    return render_template("account/login.html", **template_var)


@account.route('/reg', methods=['GET', 'POST'])
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
                # Tell Flask-Principal the identity changed
                identity_changed.send(current_app._get_current_object(), identity=Identity(user.user_id))
                template_var['owner'] = user
            session.commit()
            return render_template('index.html', **template_var)
    template_var['form'] = form
    return render_template('account/register.html', **template_var)

@account.route('/logout')
def logout():
    """
    注销用户
    """
    logout_user()
    return render_template('todo/index.html')


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

    def validate_email(self, field):
        with session_cm() as session:
            if session.query(User).filter(User.email == field.data).first():
                raise ValueError(u"该邮箱已经存在")

    def validate_username(self, field):
        with session_cm() as session:
            if session.query(User).filter(User.username == field.data).first():
                raise ValueError(u"该用户名已经存在")