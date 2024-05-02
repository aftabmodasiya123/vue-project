@ECHO OFF

set NPMDIR="C:\Program Files\nodejs\node_modules\npm\bin"
set NODEJSDIR="C:\Program Files\nodejs"
set HUBTMTAPDIR="C:\Users\PedroSarmento\source\repos\hubtmsuite\HubTMSPA"
set PATH=%PATH%;%NODEJSDIR%;%NPMDIR%
echo ---------------------------------------------------

echo cd %HUBTMTAPDIR%
pushd %HUBTMTAPDIR%

echo Start Build HubTMSPA
CMD /C npm run testbuild 
popd

echo Done.
