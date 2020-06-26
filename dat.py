import os
import sys
import django
from m.models import Point
import json


os.environ['DJANGO_SETTINGS_MODULE'] = 'm.settings'
django.setup()


def run():
    f = open("C:\\Users\\gzliy\\Desktop\\AEDmap\\Huhuan.json",
             'r', encoding='utf-8')
    j = json.loads(f.read())
    for aed in j['object']:
        id = aed['id']
        Lat = aed['aedLat']
        Lng = aed['aedLng']
        des = aed['aedAddress'] + ' ' + aed['aedPlace']
        p = Point(id=id, description=des, latitude=Lat, longitude=Lng)
        p.save()
        print('{id} Lat: {Lat} Lng: {Lng} Place: {des}'.format(
            id=id, Lat=Lat, Lng=Lng, des=des))


if __name__ == '__main__':
    run()

