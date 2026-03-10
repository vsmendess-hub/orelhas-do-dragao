'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateCharacterPage(characterId: string) {
  revalidatePath(`/personagens/${characterId}`);
}
