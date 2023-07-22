window.onload = () => {
    let option = document.querySelector('#options');
    option.addEventListener('input', ()=>{
        console.log(`Selected option :${option.value}`);
        
        let QuestionList = document.querySelector(".QuestionList");
        let pattern = document.querySelector(".pattern");
        let scrambledPin = document.querySelector(".scrambledPin");

        if( option.value == "Security Questions"){
            QuestionList.style.display = "block";
            pattern.style.display = "none"
            scrambledPin.style.display = "none";
        }
        else if( option.value == "Pattern"){
            QuestionList.style.display = "none";
            pattern.style.display = "block"
            scrambledPin.style.display = "none";
        }
        else if( option.value == "Scrambled PIN"){
            QuestionList.style.display = "none";
            pattern.style.display = "none"
            scrambledPin.style.display = "block";
        }
    })
}