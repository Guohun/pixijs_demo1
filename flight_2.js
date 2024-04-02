
(async () =>
{
    const hard_rate=2;
    const Flight_Speed=[];
    const Flight_locX=[];
    const flight_set = [];
    const explosionTextures = [];

    // Create a new application
    const app = new PIXI.Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById("pixiContainer").appendChild(app.canvas);
    // Load the animation sprite sheet
    const bunny = await  PIXI.Assets.load('./images/back_64.JPG');
    //const bunny = new PIXI.Texture.from('./images/download.png');
    const image1=new PIXI.Sprite(bunny);
    //    image1.scale.set(5);
    image1.position.set(0, 0);
    image1.scale.set(app.screen.width / image1.width, app.screen.height / image1.height);
    app.stage.addChild(image1);
        
    const mytexture = await PIXI.Assets.load('https://pixijs.com/assets/spritesheet/fighter.json');
    load_flight(mytexture,hard_rate);  


    const spritesheet = await PIXI.Assets.load('images/character.json');
    var slow_person=load_person(spritesheet);
   // app.stage.addChild(contrainer);

   // Load the animation sprite sheet
    const fire_explose = await PIXI.Assets.load('https://pixijs.com/assets/spritesheet/mc.json');
    // Create an array to store the textures
    let i;
    for (i = 0; i < 26; i++)
    {
        const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
        explosionTextures.push(texture);
    }

    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      //fill: { fill },
      stroke: { color: '#4a1850', width: 5, join: 'round' },
      dropShadow: {
          color: '#000000',
          blur: 4,
          angle: Math.PI / 6,
          distance: 6,
      },
      wordWrap: true,
      wordWrapWidth: 440,
  });

  const Score_label = new PIXI.Text({
      text: 'Score:',
      style,
  });  
  Score_label.x = 50;
  Score_label.y = 20;
  app.stage.addChild(Score_label);  
  const Score_Text = new PIXI.Text({
    text: '0',
    style,
  });
  Score_Text.x = 200;
  Score_Text.y = 20;
  app.stage.addChild(Score_Text);  




    let explosion_set=[];
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointerup', onFree);
    app.stage.on('pointerdown', onClick);

      // Animate the tiling sprite
      let count = 0;
      let Myscore=0;
      let hit_exist=new Array(hard_rate).fill(0);
      app.ticker.add(() =>
      {
          
          for (i=0; i<hard_rate; i++){
              //console.log(i,"->",flight_set[i]);
              count = Flight_Speed[i]+flight_set[i].y;
              flight_set[i].y=count;
              if (flight_set[i].y>app.screen.height){
                   flight_set[i].y=0;
                   hit_exist[i]=0;
                   Flight_locX[i]=Math.random() * app.screen.width;
                   flight_set[i].x=Flight_locX[i];
              }
              x_diff=Flight_locX[i]-slow_person.x;
              y_diff=count-slow_person.y;
             //  if (i==0)
               //    console.log(x_diff, y_diff);
              if (x_diff<35&&x_diff>-35 &&hit_exist[i]!=1)
                  if (y_diff<55&&y_diff>-55){
                      hit_exist[i]=1;
                      // Create and randomly place the animated explosion sprites on the stage
                      const explosion = new PIXI.AnimatedSprite(explosionTextures);
                      explosion.x = slow_person.x;
                      explosion.y = slow_person.y;
                      explosion.anchor.set(0.5);
                      explosion.rotation = Math.random() * Math.PI;
                      explosion.scale.set(0.75 + Math.random() * 0.5);
                    //  explosion.gotoAndPlay((Math.random() * 26) | 0);
                      explosion_set.push(explosion);
                      app.stage.addChild(explosion);
                      Myscore++;
                      Score_Text.text=Myscore.toString();
              }
          }
  
      });
    
    
      let direction='r';
    const sButton = document.getElementById('sButton');
    const eButton = document.getElementById('eButton');
   
    // Start button click handler
    sButton.addEventListener('click', function() {
        slow_person.play();
        Myscore=0;
        Score_Text.text=Myscore.toString();
        app.start();
    });

    // End button click handler
    eButton.addEventListener('click', function() {
      slow_person.stop();
      app.stop();
    });    
    
    
    

    function onClick(e)
    {
            var x= e.clientX;
            if (x>slow_person.x){
              var temp=(x-slow_person.x)
              if (temp>40) temp=40
              slow_person.x+=temp;

              
              explosion_set.forEach(element => {
                    element.x+=temp;
              });       
              if (direction=='l'){
                slow_person.scale.x= 1;
                direction='r';  
              }
              slow_person.animationSpeed = temp/4;
            }else if (x<slow_person.x){
              var temp=(slow_person.x-x)
              if (temp>40) temp=40
              slow_person.x-=temp;
              explosion_set.forEach(element => {
                    element.x-=temp;
              });  
              direction='l'        
              slow_person.animationSpeed = temp/4;
              slow_person.scale.x= -1;
            }
            var y = e.clientY;
            if (y>slow_person.y+2){
              slow_person.y+=5;
            }else if (y<slow_person.y-2){
              slow_person.y-=5;
            }
    }
    app.stop();


    function onFree(e){
      slow_person.animationSpeed = 0.5;        
    }

   function load_flight( mytexture,hard_rate){
   
            //console.log(mytexture);
            // Create an array to store the flight_set
            let i;
            const contrainer=new PIXI.Container();

            for (i = 0; i < hard_rate; i++)
            {
                const val = i < 10 ? `0${i*3}` : i*3;
                const framekey = `rollSequence00${val}.png`;
                const texture =new PIXI.Texture.from(framekey);//  PIXI.Texture.from(framekey).texture;
                const button = new PIXI.Sprite(texture);
                Flight_locX[i]=Math.random() * app.screen.width;
                button.x=Flight_locX[i]
                button.anchor.set(0.5);
                button.rotation=3
                Flight_Speed[i]= Math.random() * 8;
                if (Flight_Speed[i]<0.1) Flight_Speed[i]=0.1;
                flight_set.push(button);
                app.stage.addChild(button);
                //app.stage.addChild(flight_set);
            }
    }

    function load_person(spritesheet){
       const textures = [];
       let i;
       var p_high=0;
       for (i = 1; i < 8; i++)
       {
           const framekey = `character/walk_0${i}.png`; 
           const texture = PIXI.Texture.from(framekey);
         //  console.log(framekey, texture);
           p_high=texture.height;
           const time =150;// spritesheet.data.frames[framekey].duration; 
           textures.push({ texture, time });
       } 
       const scaling = 1;
       // Create a slow_person AnimatedSprite
       const slow_person = new PIXI.AnimatedSprite(textures);
   
       slow_person.anchor.set(0.5);
       slow_person.scale.set(scaling);
       slow_person.animationSpeed = 0.5;
       slow_person.x = (app.screen.width - slow_person.width) / 2;
       slow_person.y = app.screen.height-p_high/2;
       slow_person.play();
       app.stage.addChild(slow_person);
       return(slow_person);
    }

})();