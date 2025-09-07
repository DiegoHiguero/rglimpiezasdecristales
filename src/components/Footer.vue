
<template>
  <footer class="d-flex flex-wrap justify-content-between align-items-center py-1 my-1 "> 
<div class=" container-fluid pb-0 mb-0 justify-content-center text-light ">
        <footer>
            <div class=" section2 row my-3 justify-content-center py-3">
                <div class="col-11">
                    <div class="row ">
                        <div class="col-xl-8 col-md-4 col-sm-4 col-12   my-auto mx-auto a"><img class="mb-md-0 mb-4" src="../assets/img/sombra.png" style="width: 156px;"></div>
                        <div class="col-xl-2 col-md-4 col-sm-4 col-12"><h6 class="mb-3 mb-lg-4 bold-text "><b>MENU</b></h6><ul class="list-unstyled"><li><a class="nav-link" href="#scrollspyHeading1">Inicio</a></li><li><a class="nav-link" href="#scrollspyHeading2">Nosotros</a></li><li><a class="nav-link" href="#scrollspyHeading3">Servicios</a></li><li><a class="nav-link" href="#scrollspyHeading4">Precios</a></li><li>Sesión</li></ul></div>
                        <div class="col-xl-2 col-md-4 col-sm-4 col-12"><h6 class="mb-3 mb-lg-4 text-muted bold-text mt-sm-0 mt-5"><b>DERECHOS DE USO</b></h6>
                          <a class=" link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover " href="/confidentialite"><p class="mb-1">Politica de cookies</p><p>Politica de Privacidad</p></a> </div>
                    
                        </div>
                    <div class="row ">
                        <div class="col-xl-8 col-md-4 col-sm-4 col-auto  my-md-0 mt-5 order-sm-1 order-3 align-self-end"><p class="social text-muted mb-0 pb-0 bold-text"> <span  class="mx-2"><i class="fa fa-facebook" aria-hidden="true"></i></span> <span class="mx-2"><i class="fa fa-linkedin-square" aria-hidden="true"></i></span> <span class="mx-2"><i class="fa fa-twitter" aria-hidden="true"></i></span> <span class="mx-2"><i class="fa fa-instagram" aria-hidden="true"></i></span> </p><small class="rights"><span>&#174;</span> Royalclean All Rights Reserved.</small></div>
                        <div class="col-xl-2 col-md-4 col-sm-4 col-auto order-1 align-self-end "><h6 class="mt-55 mt-2 text-muted bold-text"><b>CONTACTO</b></h6><small> <span><i class="fa fa-envelope" aria-hidden="true"></i></span> <a href="mailto:info@royalclean.com" Subject="Aquí%20el%20asunto%20del%20mail" class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">info@royalclean.com</a></small></div>
                        <div class="col-xl-2 col-md-4 col-sm-4 col-auto order-2 align-self-end mt-3   "><h6 class="text-muted bold-text"><b>PÁGINA AMIGA</b></h6><small><span><i class="fa fa-address-book" aria-hidden="true"></i></span> <a class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="http://toucanet.fr">toucanet.fr</a></small></div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
        </footer>
 
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Rubik&display=swap');
body {
    background: linear-gradient(0deg, #fff, 50%, #DEEEFE);
    font-family: 'Rubik', sans-serif;
    background: #455A64;
    height: 100 !important;
}


.container-fluid{
    overflow:hidden; 
    margin-top: 0px ;
    background:#262626 ;
    color: #627482  !important;
    margin-bottom: 0 ;
    padding-bottom:0  ;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 20px;
}

small{
    font-size: calc(12px + (15 - 12) * ((100vw - 360px) / (1600 - 360))) !important; 
}

.bold-text{
    color: #989c9e !important;
}


.mt-55{
    margin-top: calc(50px + (60 - 50) * ((100vw - 360px) / (1600 - 360))) !important; 
}


h3{
    font-size: calc(34px + (40 - 34) * ((100vw - 360px) / (1600 - 360))) !important; 
}
 
.social{
    font-size: 21px !important; 
}

.rights{
    font-size: calc(10px + (12 - 10) * ((100vw - 360px) / (1600 - 360))) !important; 
}


/*
a{
  text-decoration: none;
  color: white;
  
  font-size: 1rem;
  text-align: left;
}
.legal {
  
  border-radius: 15px 15px 0px 0px;
  
  background-repeat: no-repeat;
  background-size: contain;
  height: 300px;
}

a:hover{
  color: #323131;
  
}

.footer {
 
  display: flex;
  justify-content: right;
  padding: 0 0px 0 15px;

  
}
        .pie {
            background-image: url('../assets/img/Madrid-2byn.jpg');
            background-repeat:no-repeat;
            background-position: center;
            background-size: cover;
            
            flex: 10 1 auto;
            justify-content:center;
            padding: 15px;
            border-radius: 15px 15px 0px 0px; 
            text-align: center;
            font-weight:600;
            height: 300px;
            margin: 0px 0px 0px 15px;
        }
        .pie a{
            text-decoration:none;
            
            background-color: none;

        }
        .pie a:hover{
            color: #7B7B7B;

        }
        .social-pie{
          flex: 1 1 auto;
          padding-top: 20px 30px 0 0;
          border-radius: 15px 15px 15px 15px;
          letter-spacing: 15px;
          background-image: url('/src/assets/img/sombra.png');
          background-size: 50%;
          background-position: center;
          height: 100%;
          width: 100%;
          background-repeat: no-repeat;
          background-color: white;
          margin-left: -13px;
          margin-right: -3px;
          margin-bottom: 0px;
          padding: 0px 0px 72px 66px;
          align-items: end;
}

        
        .social-pie a{
            text-decoration:none;
            color: #4970B6; 
            font-size: 20px;
        }
        .social-pie a:hover{
            color: #fff;
           
           }
.brands {
    color: #4970B6;
    align-items: first baseline;
   
  }
.brands :hover {
color: #fff;
}

  .brandsContainer{
    flex: auto;
    background-position:right;
    background-repeat: no-repeat;
    margin-right: 20px;
    margin-left: 20px;
    background-size:20%;
    background-color: #4970B6;
    height:100px;
  }
@media (max-width: 768px) {
  .brands {
    align-items:start;
  }
 .prof {
    color:#fff;
  }
.social-pie {
  flex: 1 1 auto;
  padding-top: 20px 30px 0 0;
  border-radius: 0px 0px 15px 15px;
  letter-spacing: 15px;
  background-image: url('/src/assets/img/sombra.png');
  background-size: contain;
  background-position: right;
  height:max-content;
  width: auto;
  background-repeat: no-repeat;
  background-color: aqua;
  margin-left: 15px;
  margin-right: 20px;
  margin-bottom: 0px;
  padding: 15px;
}
 
  }
  */
</style>