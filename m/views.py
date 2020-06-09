from django.http import HttpResponse
from django.shortcuts import render
from .models import Point

import json
from datetime import datetime
# Create your views here.


def index(request):
    return HttpResponse("This module is designed for http message.")


def distance(pos, Point):
    '''
    select的辅助函数
    '''
    return abs(Point.latitude - pos[0]) + abs(Point.longitude - pos[1])


def select(pos, Points, num):
    '''
    选出距离已知点最近的num个点
    :param pos:[Lat,Lng]
    :param Points:list Lat,Lng,description
    :param num:排序参数
    '''
    Points.sort(key=distance)
    return Points[:num]


def process(request, get):
    print(request)
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

        message = {
            'success': True,
            'time': t,
            'objects': []
        }
        for point in Point.objects.all():
            message['objects'].append({
                'Place': point.description,
                'Lat': point.latitude,
                'Lnt': point.longitude
            })
        print(message['success'])
        return HttpResponse(json.dumps(message, ensure_ascii=False),
                            content_type="application/json,charset=utf-8")
