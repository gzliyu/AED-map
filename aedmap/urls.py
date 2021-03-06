"""aedmap URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.conf.urls.static import static
from django.contrib import admin
from django.conf import settings
from django.urls import include, path

from . import views
urlpatterns = [
    path('', views.index, name="index"),
    path('blog', views.blog, name="blog"),
    path('contact-us', views.contactus, name="contact-us"),
    path('academics', views.academics, name="academics"),
    path('history', views.history, name="history"),
    path('privacy-policy', views.privacypolicy, name="privacy-policy"),
    path('search-results', views.searchresults, name="search-results"),
    path('tutors', views.tutors, name="tutors"),
    path('admin/', admin.site.urls),
    # path('login/', include("login.urls")),
    path('login/', include('login.urls')),
    path('m/', include("m.urls")),
    path('map/', include("map.urls")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
