from django.http import HttpResponse
from django.shortcuts import render
from .models import Point
from urllib import request, error
import json
from datetime import datetime
from .crdTransform import bd09_to_wgs84
from .bdapi import findRoute, distance, takeDistance
# Create your views here.


def index(request):
    return HttpResponse("This module is designed for http message.")


def select(pos, num):
    '''
    选出距离已知点最近的num个点
    :param pos:[Lat,Lng]
    :param num:排序参数
    '''
    Points = []
    # 数据库里存储的是gcj02坐标
    for point in Point.objects.all():
        dis = distance(pos, point)
        Points.append({'Place': point.description,
                       'Lat': point.latitude,
                       'Lng': point.longitude,
                       'dis': dis})
        Points.sort(key=takeDistance)
        Points = Points[:num]
        for point in Points:
            des = [point['Lat'], point['Lng']]
            # 返回坐标类型是bd09
            point['Route'] = findRoute(pos, des)
            # point['Route']['steps'] = bd09_to_wgs84(point['Route']['steps'])
            return Points


def process(request, get):
    re = json.loads(get)
    t = datetime.now().timestamp()
    # 处理请求
    message = {
        'success': True,
        'time': t,
        'objects': []
    }
    for point in Point.objects.all():
        wgscrd = bd09_to_wgs84(point.longitude, point.latitude)
        message['objects'].append({
            'Place': point.description,
            'Lat': wgscrd[1],
            'Lng': wgscrd[0]
        })
    print(message['success'])
    return HttpResponse(json.dumps(message, ensure_ascii=False),
                        content_type="application/json,charset=utf-8")


def route(request, get):
    re = json.loads(get)
    t = datetime.now().timestamp()

    pos = [re['Lat'], re['Lng']]
    message = {
        'success': True,
        'time': t,
        'objects': select(pos, 3)
    }
    return HttpResponse(json.dumps(message, ensure_ascii=False),
                        content_type="application/json,charset=utf-8")
