@echo off
REM 模拟grep
REM 在文件中搜索字符串。
REM FIND [/V] [/C] [/N] [/I] [/OFF[LINE]] "string" [[drive:][path]filename[ ...]]
REM /I  搜索字符串时忽略大小写。


find /I "%1"
