<form class="form-horizontal text-left" method="post" action="Setting/userinfo/">
    <div class="control-group">
        <label class="control-label" for="inputEmail">用户名</label>
        <div class="controls">
            <input id="id_username" maxlength="30" name="username" type="text" value="sarike">
            <span class="label label-info"></span>
            <span class="help-block">您的主页地址 http://www.timefly.cn/sarike</span>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputPassword">邮箱地址</label>
        <div class="controls">
            <input id="id_email" maxlength="75" name="email" type="text" value="821398245@qq.com">
            <span class="label label-info"></span>
            <span class="help-block">（不公开显示）你可以用该邮箱来登录 TimeFly 以及接收邮件提醒</span>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="inputPassword">个人描述</label>
        <div class="controls">
            <textarea cols="40" id="id_description" name="description" rows="5">我“天涯囧侠”，让我们一起来把握青春。
Put up or shut up！</textarea>
            <span class="label label-info"></span>
            <span class="help-block">简单说一下你自己，写出你自己的奋斗宣言</span>
        </div>
    </div>
    <div class="control-group">
        <div class="controls">
            <button type="submit" class="btn btn-info">保存更改</button>
        </div>
    </div>
</form>