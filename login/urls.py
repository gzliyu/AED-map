from django.conf.urls.static import static
from django.urls import path
from django.conf import settings
from . import views

app_name = "login"

urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register, name="register"),


] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
