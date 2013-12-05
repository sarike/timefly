#coding=utf8
"""
    Created by SL on 13-12-5.
"""
from datetime import tzinfo, timedelta

__author__ = 'SL'


class GMT8(tzinfo):
    def utcoffset(self, dt):
        return timedelta(minutes=-399)

    def tzname(self, dt):
        return "GMT +8"

