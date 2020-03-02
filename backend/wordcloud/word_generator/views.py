# from django.shortcuts import render
from django.http import HttpResponse
from word_generator.utils.word_cloud import word_clouder
from word_generator.utils.word_segment import word_segmenter
import os
from project import settings
from PIL import Image
import base64

default_image = settings.BASE_DIR + '/static/backgrounds/default.jpg'


def upload_info(request):
    if request.method == 'POST':
        pic = request.FILES.get('image', None)
        print(pic)
        print(pic.name)
        text = request.POST.get('text')
        print('text', text)
        bgColor = request.POST.get('bgColor')
        color_adaption = request.POST.get('colorAdaption')
        if bgColor == None or bgColor == '':
            bgColor = 'white'

        if color_adaption == None:
            color_adaption = False
        else:
            color_adaption = True if color_adaption == 1 or color_adaption == '1' else False

        if pic != None:
            pic_name = pic.name
            origin_pic_save_path = os.path.join(
                settings.BASE_DIR, 'static/backgrounds/{}'.format(pic.name))
            Image.open(pic).save(origin_pic_save_path)
        else:
            pic_name = 'default.jpg'
        generate_wordcloud(text, pic_name, bgColor, color_adaption)
        new_pic_path = os.path.join(
            settings.BASE_DIR, 'static/resume/images/{}'.format(pic_name))
        with open(new_pic_path, 'rb') as f:
            new_pic = f.read()
        return HttpResponse(base64.b64encode(new_pic), content_type='image/png')

# def getDefaultImgs(request):
#     if request.method == 'GET':
#         defaultImgs =


def generate_wordcloud(text, pic_name, background_color, color_adaption):
    segmenter = word_segmenter(text)
    words = segmenter.split_word()
    clouder = word_clouder(words, pic_name, background_color, color_adaption)
    new_pic = clouder.word_cloud_generator()
    return new_pic
