import jieba
from project import settings


dic_path = settings.BASE_DIR + '/word_generator/utils/stop_words.txt'


class word_segmenter():
    def __init__(self, text, dic_path=dic_path):
        self.text = text
        self.dic_path = dic_path

    def get_dic_words(self):
        dic_words = {}.fromkeys(
            [line.rstrip() for line in open(self.dic_path, encoding='utf-8')])
        return dic_words

    def wash_text(self):
        self.text = self.text.encode(
            encoding="utf-8", errors="ignore").decode("utf-8")
        return self.text

    def split_word(self):
        seq = ''
        dic_words = self.get_dic_words()
        text = self.wash_text()
        segs = jieba.cut(text, cut_all=False)
        for seg in segs:
            if seg not in dic_words:
                seq = seq + seg + " "
        return seq
