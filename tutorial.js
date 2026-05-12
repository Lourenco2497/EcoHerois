window.onload = function() {

    document.getElementById('btn-comecartut').onclick = function () {
        document.getElementById('fundo-gradiente').style.display = 'none';
        document.getElementById('tut1').style.display = 'block';
    }

    document.getElementById('tras1').onclick = function () {
        document.getElementById('tut1').style.display = 'none';
        document.getElementById('fundo-gradiente').style.display = 'block';
    }

    document.getElementById('frente1').onclick = function () {
        document.getElementById('tut1').style.display = 'none';
        document.getElementById('tut2').style.display = 'block';
    }


    document.getElementById('tras2').onclick = function () {
        document.getElementById('tut2').style.display = 'none';
        document.getElementById('tut1').style.display = 'block';
    }

    document.getElementById('frente2').onclick = function () {
        document.getElementById('tut2').style.display = 'none';
        document.getElementById('tut3').style.display = 'block';
    }

    document.getElementById('tras3').onclick = function () {
        document.getElementById('tut3').style.display = 'none';
        document.getElementById('tut2').style.display = 'block';
    }

    document.getElementById('frente3').onclick = function () {
        document.getElementById('tut3').style.display = 'none';
        document.getElementById('tut4').style.display = 'block';
    }

    document.getElementById('tras4').onclick = function () {
        document.getElementById('tut4').style.display = 'none';
        document.getElementById('tut3').style.display = 'block';
    }

    document.getElementById('frente4').onclick = function () {
        document.getElementById('tut4').style.display = 'none';
        document.getElementById('tut5').style.display = 'block';
    }

    document.getElementById('tras5').onclick = function () {
        document.getElementById('tut5').style.display = 'none';
        document.getElementById('tut4').style.display = 'block';
    }

    document.getElementById('frente5').onclick = function () {
        document.getElementById('tut5').style.display = 'none';
        document.getElementById('fundo-gradiente').style.display = 'block';
    }
}