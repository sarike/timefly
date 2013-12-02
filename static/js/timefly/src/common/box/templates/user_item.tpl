<a class="pull-left" href="#<%=username %>"> <img
        class="media-object img-rounded"
        src="http://www.gravatar.com/avatar/<%=avatar_hash %>?d=identicon"
        class="img-rounded" alt="Avatar">
</a>

<div class="media-body">
    <h4 class="media-heading">
        <a href="#<%=username %>">
            <%=nickname %>
        </a>
    </h4>
    <%=description || '还没来得及说点什么呢' %>
</div>