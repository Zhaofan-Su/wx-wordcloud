
from scipy.misc import imread, imsave
from wordcloud import WordCloud
from project.settings import BASE_DIR
import wordcloud as wc

font_base_path = BASE_DIR + '/word_generator/utils/fonts/'


class word_clouder():
    def __init__(self, text, img_name, background_color, color_adaption):
        self.text = text
        self.img_name = img_name
        self.background_color = background_color
        self.color_adaption = color_adaption

    def word_cloud_generator(self, font_name="ShangShouXiuYuanTi.ttf"):
        origin_img_path = BASE_DIR + '/static/backgrounds/' + self.img_name
        new_img_path = BASE_DIR + '/static/resume/images/' + self.img_name
        mask_image = imread(origin_img_path, flatten=False)
        if self.color_adaption:
            image_colors = wc.ImageColorGenerator(mask_image)
            word_pic = WordCloud(
                font_path=font_base_path+font_name,
                background_color=self.background_color,
                mask=mask_image,
                color_func=image_colors
            ).generate(self.text)
        else:
            word_pic = WordCloud(
                font_path=font_base_path+font_name,
                background_color=self.background_color,
                mask=mask_image
            ).generate(self.text)
        imsave(new_img_path, word_pic)
        return new_img_path
