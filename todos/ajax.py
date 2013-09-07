'''
Created on 2013-6-14

@author: Sarike
'''
from dajaxice.decorators import dajaxice_register
from django.utils import simplejson
from todos.models import Todo
import logging

logger = logging.getLogger("timefly.custom")

@dajaxice_register
def DeleteTodo(request, todo_id):
    logger.info("delete todo....")
    try:
        todo = Todo.objects.get(pk = todo_id)
        todo.todo_is_deleted = True
        todo.save()
    except Exception:
        return simplejson.dumps({'flag':'0'})
    return simplejson.dumps({'flag':'1'})

@dajaxice_register
def MarkComplete(request, todo_id):
    logger.info("mark complete....")
    try:
        todo = Todo.objects.get(pk = todo_id)
        todo.todo_is_completed = not todo.todo_is_completed
        todo.save()
    except Exception:
        return simplejson.dumps({'flag':'0'})
    return simplejson.dumps({'flag':'1',
                             'completed':todo.todo_is_completed})

@dajaxice_register
def ChangeVisibale(request, todo_id):
    logger.info("change visibale....")
    try:
        todo = Todo.objects.get(pk = todo_id)
        todo.todo_visibale = not todo.todo_visibale
        todo.save()
    except Exception:
        return simplejson.dumps({'flag':'0'})
    return simplejson.dumps({'flag':'1',
                             'visibale' : todo.todo_visibale})

    