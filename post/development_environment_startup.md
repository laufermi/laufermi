# Development Environment



## Terminal

### Brew

```bash
brew list                                                                                                                                                                  node system
==> Formulae
autoconf		gh			libarchive		libxau			maven			pixman			rpm
autojump		giflib			libb2			libxcb			mpdecimal		pkgconf			sqlite
bash			glib			libmagic		libxdmcp		ncurses			popt			telnet
brotli			go			libnghttp2		libxext			node			powerlevel10k		xorgproto
c-ares			graphite2		libomp			libxrender		nvm			pyenv			xz
ca-certificates		harfbuzz		libpng			little-cms2		oniguruma		python-packaging	yarn
cairo			helm			libtiff			lua			openjdk			python@3.11		zplug
fontconfig		icu4c@76		libunistring		lz4			openssl@3		python@3.13		zsh
freetype		jpeg-turbo		libuv			lzo			pcre			readline		zstd
gettext			jq			libx11			m4			pcre2			redis

==> Casks
appcleaner		bruno			figma			google-chrome		microsoft-auto-update	microsoft-teams		orbstack
bilibili		fbreader		follow			iterm2			microsoft-office	mweb-pro		zoom
```

### Alias

```bash
vi ~/.zshrc

# Update Oh My Zsh, Homebrew
export up='omz update && brew upgrade && brew list --cask | xargs brew upgrade --cask && brew cleanup'
```
