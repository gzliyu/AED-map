from django.conf.urls.static import static
from django.urls import path
from django.conf import settings
from . import views

app_name = "map"


urlpatterns = [
    path("<str:pos>", views.index, name="index"),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
