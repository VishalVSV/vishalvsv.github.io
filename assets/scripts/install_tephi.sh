tempfile=$(mktemp "$BASH_SOURCE".XXXXXX)
if curl -s https://raw.githubusercontent.com/VishalVSV/Tephi/main/tephi >"$tempfile"; then
    cp $tempfile $HOME/.local/bin/tephi
    chmod +x $HOME/.local/bin/tephi
    echo "Tephi installed!"
    echo
    echo
    tephi
    rm -f -- "$tempfile"
else
    rm -f -- "$tempfile"
    echo "Unable to download Tephi!"
    exit 1
fi