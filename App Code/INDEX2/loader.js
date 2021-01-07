var myVar;
<<<<<<< Updated upstream
function myFunction() 
{
=======

function myFunction() {
>>>>>>> Stashed changes
  myVar = setTimeout(showPage, 1000);
}

function showPage() 
{
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

   