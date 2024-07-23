const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipecontainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const recipePopup = recipeDetailsContent.parentElement;

const fetchRecipes = async (query) => {
  recipecontainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();
    recipecontainer.innerHTML = "";
    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        `;

      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipecontainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipecontainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
  }
};

const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div>
      <h3 class="recipeInstructions">Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;

  recipePopup.style.display = "block";
};

const closeRecipePopup = () => {
  recipePopup.style.display = "none";
};

recipeCloseBtn.addEventListener("click", closeRecipePopup);

document.addEventListener("click", (event) => {
  if (
    recipePopup.style.display === "block" &&
    !recipeDetailsContent.contains(event.target) &&
    !recipecontainer.contains(event.target) &&
    !searchBox.contains(event.target) &&
    !searchBtn.contains(event.target)
  ) {
    closeRecipePopup();
  }
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipecontainer.innerHTML = `<h2>Type the meal in the search box</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});
