# -*- coding: utf-8 -*-

from tkinter import *
import os


root = Tk()
def specifications():
    b.pack_forget()
    cpu_options = Label(text="Операционная система: \t"+
        os.environ["OS"]+"\n"+
        "Архитектура процессора: \t"+
        os.environ["PROCESSOR_ARCHITECTURE"]+"\n"+
        "Количество ядер: \t"+str(os.cpu_count()), bg="#445d5b", fg="#f8d862")
    cpu_options.pack()
def compatibility():
    b1.pack_forget()
    if os.environ["OS"] == "Windows 11":
        res = Label(text="У вас уже Windows 11", bg="#445d5b", fg="#f8d862")
        res.pack()
    if  os.environ["PROCESSOR_ARCHITECTURE"][-2:] == "64" and \
        os.cpu_count() >= 2:
        res = Label(text="\nСовместим с Windows 11\n", bg="#445d5b", fg="#f8d862")
        res.pack()
    else:
        res = Label(text="\nНе совместим с Windows 11\n", bg="#445d5b", fg="#f8d862")
        res.pack()
root.title("Windows11 tester")
root.geometry("500x400+300+150")
root.iconbitmap("icon_1.ico")
root["background"]="#445d5b"
l = Label(text="Привет "+os.getlogin()+"\n"+
"Это моя первая программа, она определяет поддерживается ли установка Windows 11" \
          ,bg="#445d5b", fg="#f8d862")
b = Button(text="характеристики", bg="#445d5b", fg="#f8d862", command=specifications)
b1 = Button(text="совместимость", bg="#445d5b", fg="#f8d862", command=compatibility)

l.pack(side=TOP)
b.pack(side=BOTTOM)
b1.pack(side=BOTTOM)
root.mainloop()
