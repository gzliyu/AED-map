from django.http import HttpResponse
from django.shortcuts import render
from .models import Point
from urllib import request, error
import json
from datetime import datetime
# Create your views here.


def index(request):
    return HttpResponse("This module is designed for http message.")


def distance(pos, Point):
    '''
    select的辅助函数
    '''
    if type(Point) == Point:
        return abs(Point.latitude - pos[0]) + abs(Point.longitude - pos[1])
    if type(Point) == dict:
        return abs(Point['Lat'] - pos[0]) + abs(Point['Lng'] - pos[1])


def findRoute(origin, destination):
    '''
    调用baidu/supermap路径规划api，规划两点路劲
    :param origin:[Lat,Lng]
    :param destination：[Lat,Lng]
    '''
    try:
        url = ('http://api.map.baidu.com/directionlite/v1/walking?'
               + 'origin={ORI_LAT},{ORI_LNG}&destination={DES_LAT},{DES_LNG}&'
               + 'ak={AK}').format(ORI_LAT=origin[0],
                                   ORI_LNG=origin[1],
                                   DES_LAT=destination[0],
                                   DES_LNG=destination[1],
                                   AK="WVOELSu3tQVy2hjGDNyr7PRXkLNj8Yp9"
                                   )
        re = request.urlopen(url)
        data = json.loads(re.read().decode('utf-8'))
        if data['status'] == 0:
            duration = data['result']['routes'][0]['duration']
            steps = data['result']['routes'][0]['steps']
            stps = []
            for stp in steps:
                stps.append([stp["start_location"],
                             stp["end_location"]])

            stps.append(steps[-1]["start_location"],
                        steps[-1]["end_location"])

            return {
                'duration': duration,
                'steps': stps
            }

        else:
            print("route api return status error")
            return - 1
    except HTTPError as err:
        print("route http error" + str(err.code) + err.reason)
        return - 1


def select(pos, origin, num):
    '''
    选出距离已知点最近的num个点
    :param pos:[Lat,Lng]
    :param num:排序参数
    '''
    distanceThreshold = 0.005
    Points = []
    for point in Point.objects.all():
        if distance(pos, point) < distanceThreshold:
            Points.append({'Place': point.description,
                           'Lat': point.latitude,
                           'Lng': point.longitude})
        if len(Points) <= num:
            for point in Points:
                des = [point['Lat'], point['Lng']]
                point['Route'] = findRoute(pos, des)
            return Points
        else:
            Points.sort(key=distance)
            result = []
            for i in range(num):
                des = [point['Lat'], point['Lng']]
                result.append({
                    'Place': point['Place'],
                    'Lat': point['Lat'],
                    'Lng': point['Lng'],
                    'Route': findRoute(pos, des)
                })
            return result


def process(request, get):
    print(request)
    re = json.dumps(get)
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
        if re['type'] == 'FindRoute':
            pos = re['position']
            message = {
                'success': True,
                'time': t,
                'objects': select(pos, 3)
            }
            print("Route", message['success'])
            return HttpResponse(json.dumps(message, ensure_ascii=False),
                                content_type="application/json,charset=utf-8")

        else:
            message = {
                'success': True,
                'time': t,
                'objects': []
            }
            for point in Point.objects.all():
                message['objects'].append({
                    'Place': point.description,
                    'Lat': point.latitude,
                    'Lng': point.longitude
                })
            print(message['success'])
            return HttpResponse(json.dumps(message, ensure_ascii=False),
                                content_type="application/json,charset=utf-8")
