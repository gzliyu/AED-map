
from .crdTransform import bd09_to_wgs84
import requests
import json
def distance(pos, Point):
    '''
    select的辅助函数
    '''
    if type(Point) == Point:
        return abs(Point.latitude - pos[0]) + abs(Point.longitude - pos[1])
    if type(Point) == dict:
        return abs(Point['Lat'] - pos[0]) + abs(Point['Lng'] - pos[1])


def takeDistance(elem):
    return elem['dis']


def findRoute(origin, destination):
    print(destination)
    print(origin)
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
                                   )+'&coord_type=gcj02&ret_coordtype=bd09ll'
        print(url)
        re = requests.get(url)
        data = json.loads(re.text)
        print(re.text)
        if data['status'] == 0:
            duration = data['result']['routes'][0]['duration']
            steps = data['result']['routes'][0]['steps']
            stps = []
            stps.append([steps[0]["start_location"]["lat"],
                         steps[0]["start_location"]["lng"]])
            for stp in steps:
                stps.append([stp["end_location"]["lat"],
                             stp["end_location"]["lng"]])
                # 'steps': bd09_to_wgs84(stps)
            return {
                'duration': duration,

                'steps': stps
            }

        else:
            print("route api return status error")
            return - 1
    except IndexError:
        # print("route http error" + str(err.code) + err.reason)
        return - 1
