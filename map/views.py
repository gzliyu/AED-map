from django.shortcuts import render

# Create your views here.


def index(request, pos):
    return render(request, "map/index.html", {
        'lat': 23,
        'lot': 23,
        'host_url': 'http://127.0.0.1:8000/m/',
    })


def route(request):
    return render(request, "map/route.html")


def test(request):
    return render(request, "map/bd.html")
