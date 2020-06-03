from django.http import HttpResponse
from django.shortcuts import render
import json
from datetime import datetime
# Create your views here.


def index(request):
    return HttpResponse("This module is designed for http message.")


def process(request, get):
    getmessage = json.dumps(get)
    t = datetime.now().timestamp()
    # 验证不成功或者其他错误情况
    if False:
        message = json.dumps({
            'success': False,
            'time': t,
            'code': 403,
        })
        return HttpResponse(message)
    else:
        # 处理请求
        message = json.dumps({
            'success': True,
            'time': t,
            'data': {

            },
        })
        return HttpResponse(message)
