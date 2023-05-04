import { SkinTone, Category } from "../emoji";

const getEnumKeyByValue = (type: object, value: string): string => {
  const keys = Object.keys(type);
  const values = Object.values(type);
  const valueIndex = values.indexOf(value);

  if (valueIndex === -1) {
    throw new Error(`Key not found for value: ${value}. In enum: ${type}`);
  }

  return keys[valueIndex];
};

enum TemojiActionType {
  SET_SKINTONE = "skinTone",
  SET_CATEGORY = "category"
}

interface TemojiActionPayload {
  skinTone: SkinTone;
  category: Category;
}

interface TemojiAction {
  type: TemojiActionType;
  payload: TemojiActionPayload;
}

const buildActionObject = (action: TemojiAction) => {
  return {
    type: getEnumKeyByValue(TemojiActionType, action.type).toUpperCase(),
    payload: { ...action.payload }
  };
};

const initialState: TemojiActionPayload = {
  skinTone: SkinTone.UNSET,
  category: Category.SMILEYS_AND_EMOTION
};

export const TemojiReducer = (state = initialState, action: TemojiAction) => {
  const actionType = action.type;
  return { ...state, [actionType]: action.payload[actionType] };
};

export const TestComp = () => {
  return <p>{JSON.stringify(
    TemojiReducer(initialState, {
      type: TemojiActionType.SET_SKINTONE,
      payload: {
        skinTone: SkinTone.LIGHT,
        category: Category.SMILEYS_AND_EMOTION
      }
    })
  )}</p>;
};