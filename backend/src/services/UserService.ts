import prisma from '../lib/prisma.js';

export class UserService {
  private static XP_PER_LEVEL = 1000;

  /**
   * Calculate level based on total XP
   */
  static calculateLevel(xp: number): number {
    return Math.floor(xp / this.XP_PER_LEVEL) + 1;
  }

  /**
   * Add XP to a user and update their level if necessary
   */
  static async addXp(userId: string, amount: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const newXp = user.xp + amount;
    const newLevel = this.calculateLevel(newXp);

    // Only update if XP or level changed (which they always will with > 0 amount)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
      },
      select: {
        id: true,
        xp: true,
        level: true,
      },
    });

    return {
      previousLevel: user.level,
      newLevel: updatedUser.level,
      leveledUp: newLevel > user.level,
      xpAdded: amount,
      currentXp: newXp,
    };
  }
}
