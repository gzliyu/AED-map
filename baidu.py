from urllib import request, error
import json


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
            return {
                'duration': duration,
                'steps': steps
            }

        else:
            print("route api return status error")
            return - 1
    except error.HTTPError as err:
        print("route http error" + str(err.code) + err.reason)
        return - 1


res = findRoute([40.01116, 116.339303], [39.936404, 116.452562])
with open("./test.json", 'w', encoding='utf-8') as f:
    f.write(str(res))
    f.close()
