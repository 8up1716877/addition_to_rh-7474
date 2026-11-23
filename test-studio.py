from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1000}); errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://localhost:4200');page.wait_for_timeout(700)
 page.get_by_role('button',name='New project',exact=True).click()
 page.get_by_label('Project name',exact=True).fill('Test adventure')
 page.get_by_role('button',name='Create project',exact=True).click()
 assert page.get_by_role('heading',name='Test adventure').count()==1
 page.goto('http://localhost:4200/#characters');page.get_by_label('name',exact=True).fill('Milo Test')
 page.reload();assert page.get_by_label('name',exact=True).input_value()=='Milo Test'
 page.goto('http://localhost:4200/#story');page.get_by_label('Story text',exact=True).fill('A new adventure begins here.')
 page.reload();assert page.get_by_label('Story text',exact=True).input_value()=='A new adventure begins here.'
 page.goto('http://localhost:4200/#sketch');c=page.get_by_label('Drawing canvas');r=c.bounding_box()
 page.mouse.move(r['x']+150,r['y']+150);page.mouse.down();page.mouse.move(r['x']+250,r['y']+190,steps=10);page.mouse.up()
 assert page.evaluate('JSON.parse(localStorage.getItem("heather-sketch")).length')==1
 with page.expect_download() as dl:page.get_by_role('button',name='Export PNG',exact=True).click()
 assert dl.value.suggested_filename=='heather-sketch.png'
 page.get_by_role('button',name='Undo',exact=True).click();assert page.evaluate('JSON.parse(localStorage.getItem("heather-sketch")).length')==0
 page.get_by_role('button',name='Redo',exact=True).click();assert page.evaluate('JSON.parse(localStorage.getItem("heather-sketch")).length')==1
 for section in ['dashboard','sketch','characters','story','comic','lab','animation','scene','voice','assets','projects']:
  page.goto('http://localhost:4200/#'+section);page.wait_for_timeout(160)
  assert page.locator('main h1').count()==1,section
  assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),section
 page.goto('http://localhost:4200/#comic');page.get_by_role('button',name='Add panel',exact=True).click();assert page.locator('.comic-panel').count()==4
 page.get_by_label('Speech bubble',exact=True).fill('Hello Heather!')
 with page.expect_download() as dl:page.get_by_role('button',name='Export storyboard',exact=True).click()
 assert dl.value.suggested_filename=='comic-storyboard.png'
 page.goto('http://localhost:4200/#animation');page.get_by_role('button',name='Play',exact=True).click();assert page.locator('.animated-mascot').count()==1
 page.goto('http://localhost:4200/#dashboard');page.get_by_role('button',name='Toggle theme',exact=True).click();assert page.locator('.studio.dark').count()==1
 page.get_by_role('button',name='Toggle theme',exact=True).click()
 page.evaluate('localStorage.clear()');page.reload();page.wait_for_timeout(400)
 page.screenshot(path='/home/user/heather-dashboard.png',full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path='/home/user/heather-mobile.png',full_page=True)
 assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
 page.get_by_role('button',name='Open navigation',exact=True).click();assert page.locator('.sidebar.mobile-open').count()==1
 page.get_by_role('button',name='Sketch Studio',exact=True).click();assert page.get_by_label('Drawing canvas').count()==1
 assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
 assert not errors,errors
 print('PASS: all 11 screens, project creation, character/story persistence, drawing, undo/redo, PNG exports, comic edits, animation playback, theme, responsive navigation. No browser errors.')
 b.close()
