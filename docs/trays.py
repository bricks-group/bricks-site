"""Product-frame trays: Kam's real photography, softened so the UI reads (replaces the painted trays).
One recipe for all: covers.py grade -> 30% lift toward off-white -> Gaussian blur r=3 @1600w. Fixed 16:10 crop."""
import sys; sys.path.insert(0,'/workspace/ship/visual-system')
from PIL import Image, ImageFilter
import numpy as np
R='/workspace/copy-pass/repo/public'
INK=np.array([0x14,0x11,0x0E],float)/255; PAPER=np.array([0xF4,0xF1,0xEB],float)/255
def grade(im):
  a=np.asarray(im.convert('RGB')).astype(float)/255
  L=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]
  a=L+(a-L)*0.78; a=INK+(PAPER-INK)*a; duo=INK+(PAPER-INK)*L; a=a*0.85+duo*0.15
  a=a*0.70+PAPER*0.30
  return Image.fromarray((np.clip(a,0,1)*255).astype('uint8'))
def crop(im,ar=1.6,fy=.5):
  w,h=im.size
  if w/h>ar: nw=int(h*ar); x=(w-nw)//2; return im.crop((x,0,x+nw,h))
  nh=int(w/ar); y=int((h-nh)*fy); return im.crop((0,y,w,y+nh))
SRC={'desk':('drone-cre-0439.jpg',.35),'crm':('res-living-1.jpg',.5),'book':('res-ext-1.jpg',.6),'disp':('work/01.jpg',.55)}
for k,(f,fy) in SRC.items():
  im=crop(Image.open(f'{R}/media/{f}').convert('RGB'),1.6,fy).resize((1600,1000),Image.LANCZOS)
  im=grade(im.filter(ImageFilter.GaussianBlur(3)))
  for w in (900,1600):
    r=im.resize((w,int(w/1.6)),Image.LANCZOS); r.save(f'{R}/media/trays/{k}-{w}.webp',quality=78,method=6); r.save(f'{R}/media/trays/{k}-{w}.avif',quality=55)
print('ok')
