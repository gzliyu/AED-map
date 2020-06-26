from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("<str:get>", views.process, name="process"),
    path("route/<str:get>",views.route,name="route"),
]
