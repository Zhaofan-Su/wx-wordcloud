from django.urls import path

from . import views

urlpatterns = [
    path('uploadInfo', views.upload_info, name="upload")
]
