import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { items, isLoading, error } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (!items.length && !isLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length, isLoading]);

  const ingredientData = useMemo(
    () => items.find((ing) => ing._id === id),
    [items, id]
  );

  useEffect(() => {
    if (!isLoading && !error && items.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length, isLoading, error, id]);

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
