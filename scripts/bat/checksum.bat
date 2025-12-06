@echo OFF
:LOOP
    set index=%1
    if %index%! == ! goto END
	echo.
    echo File   : %index%
    echo.
    set /p="MD5    : "<nul
    certutil -hashfile "%index%" MD5|findstr /V "MD5"|findstr /V "CertUtil"
    set /p="SHA1   : "<nul
	certutil -hashfile "%index%" SHA1|findstr /V "SHA1"|findstr /V "CertUtil"
	set /p="SHA256 : "<nul
	certutil -hashfile "%index%" SHA256|findstr /V "SHA256"|findstr /V "CertUtil"
	
	shift
	goto LOOP
:END
echo.

 
