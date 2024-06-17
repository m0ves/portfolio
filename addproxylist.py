# -*- coding: utf-8 -*-


"""
Мне было лень переписывать бесплатные прокси в proxychains и я написал этот скрипт, который автоматически парсит прокси с сайта: 
https://advanced.name/ru/freeproxy?type=socks5 
файл нужно переместить в папку с proxychains.conf
"""

from bs4 import BeautifulSoup
import requests
import base64


def del_proxy():
    with open("proxychains4.conf", "r") as f: # proxy с 117 линии
        lines = f.readlines()
        col = len(lines) - 116
        lines = lines[:-col]
    with open("proxychains4.conf", "w") as f:
        f.writelines(lines)
    
def addproxy(len_proxy):
    url = "https://advanced.name/ru/freeproxy?type=socks5"
    header = {
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36"
    }
    proxy = {
        "ip": [],
        "port": []
    }
    page = requests.get(url, headers=header)
    bs = BeautifulSoup(page.text, "html.parser")
    for i in bs.findAll("td"):
        if i.get("data-ip") != None :
            data = base64.b64decode(i.get("data-ip")).decode("utf-8")
            proxy["ip"].append(data)
        if i.get("data-port") != None:
            data = base64.b64decode(i.get("data-port")).decode("utf-8")
            proxy["port"].append(data)
    with open("proxychains4.conf", "a") as cfile:
        for i in range(len_proxy):
            cfile.writelines("".join("\nSOCKS5"+"\t"+proxy["ip"][i]+"\t"+proxy["port"][i]))
            
def main():
    print("**Внимание! Чем больше прокси, тем ниже скорость интернета**")
    len_proxy = input("введите количество прокси: ")
    f = open("proxychains4.conf", "r")
    lines = f.readlines()
    if len(lines) > 117:
        del_proxy()
    if str(len_proxy).isdigit():
        len_proxy = int(len_proxy)
        addproxy(len_proxy)
    else:
        print("Некорректный ввод")
        exit()
        

if __name__ == "__main__":
    try:
    	main()
    except Exception as e:
        print("проверьте ввод или соединение с интернетом")
    
