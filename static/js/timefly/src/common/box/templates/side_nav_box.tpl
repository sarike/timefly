<div id="menu">
    <ul class="nav nav-list">
        <% _.each(side_nav_list, function(nav){ %>
        <li data-id="<%=nav.id %>" <% if(nav.active){ %>class="active"<% } %>>
            <a href="javascript: void(0)"><%=nav.caption %><i class="icon-chevron-right pull-right"></i></a>
        </li>
        <% });%>
    </ul>
</div>