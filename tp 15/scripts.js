document.addEventListener('DOMContentLoaded', () => {
    const recipeList = document.getElementById('recipeList');
    const spinner = document.getElementById('spinner');

    // Escuchar eventos de los botones para cargar recetas
    document.getElementById('chineseBtn').addEventListener('click', () => {
        fetchRecipes('Chinese');
    });

    document.getElementById('italianBtn').addEventListener('click', () => {
        fetchRecipes('Italian');
    });

    document.getElementById('americanBtn').addEventListener('click', () => {
        fetchRecipes('American');
    });

    function fetchRecipes(category) {
        // Mostrar el spinner antes de iniciar la carga
        spinner.style.display = 'block';
        recipeList.innerHTML = ''; // Limpiar la lista de recetas anterior

        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${category}`)
            .then(response => response.json())
            .then(data => {
                // Ocultar el spinner después de cargar los datos
                spinner.style.display = 'none';
                displayRecipes(data.meals);
            })
            .catch(error => {
                // Ocultar el spinner incluso en caso de error
                spinner.style.display = 'none';
                console.error('Error fetching recipes:', error);
            });
    }

    function displayRecipes(recipes) {
        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card">
                    <img src="${recipe.strMealThumb}" class="card-img-top" alt="${recipe.strMeal}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.strMeal}</h5>
                        <button class="btn btn-primary" onclick="fetchRecipeDetails(${recipe.idMeal})">Ver más</button>
                    </div>
                </div>
            `;
            recipeList.appendChild(card);
        });
    }

    window.fetchRecipeDetails = function(idMeal) {
        // Mostrar el spinner mientras se cargan los detalles de la receta
        spinner.style.display = 'block';

        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
            .then(response => response.json())
            .then(data => {
                // Ocultar el spinner después de cargar los detalles
                spinner.style.display = 'none';
                showRecipeDetails(data.meals[0]);
            })
            .catch(error => {
                // Ocultar el spinner en caso de error
                spinner.style.display = 'none';
                console.error('Error fetching recipe details:', error);
            });
    }

    function showRecipeDetails(recipe) {
        const modalContent = `
            <div class="modal fade" id="recipeModal" tabindex="-1" role="dialog" aria-labelledby="recipeModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="recipeModalLabel">${recipe.strMeal}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <img src="${recipe.strMealThumb}" class="img-fluid mb-3" alt="${recipe.strMeal}">
                            <h5>Ingredientes:</h5>
                            <ul>
                                ${getIngredientsList(recipe)}
                            </ul>
                            <h5>Instrucciones:</h5>
                            <p>${recipe.strInstructions}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalContent);
        $('#recipeModal').modal('show');
        $('#recipeModal').on('hidden.bs.modal', function () {
            this.remove();
        });
    }

    function getIngredientsList(recipe) {
        let ingredients = '';
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient) {
                ingredients += `<li>${ingredient} - ${measure}</li>`;
            }
        }
        return ingredients;
    }
});
