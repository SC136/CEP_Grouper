import prisma from './prisma';

export const validateRollNumber = async (rollNumber: string): Promise<boolean> => {
  // Convert roll number to integer for comparison
  const rollNum = parseInt(rollNumber, 10);
  
  if (isNaN(rollNum)) {
    return false;
  }
  
  // Check if roll number is in any of the allowed ranges
  const classRanges = await prisma.classRollRange.findMany();
  
  return classRanges.some(range => 
    rollNum >= range.minRoll && 
    rollNum <= range.maxRoll
  );
};
