@ECHO OFF

set NPMDIR="C:\Program Files\nodejs\node_modules\npm\bin"
set NODEJSDIR="C:\Program Files\nodejs"
set BAGTMDIR="C:\Users\PedroSarmento\Source\repos\trackmanagement\HubTMSPA"
set PATH=%PATH%;%NODEJSDIR%;%NPMDIR%
echo ---------------------------------------------------

echo cd %BAGTMDIR%
pushd %BAGTMDIR%

echo Start Build HubTMSPA
CMD /C npm run build 
popd

echo Done.
