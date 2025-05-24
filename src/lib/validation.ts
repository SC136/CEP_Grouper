import prisma from './prisma';

export const validateRollNumber = async (rollNumber: string): Promise<boolean> => {
  try {
    // Convert roll number to integer for comparison
    const rollNum = parseInt(rollNumber, 10);
    
    if (isNaN(rollNum)) {
      return false;
    }
    
    // Check if roll number is in any of the allowed ranges
    // Only select the fields we need to ensure consistency across database providers
    const classRanges = await prisma.classRollRange.findMany({
      select: {
        className: true,
        minRoll: true, 
        maxRoll: true
      }
    });
    
    if (!classRanges || classRanges.length === 0) {
      console.error("No class ranges found in database");
      return false;
    }
    
    return classRanges.some(range => 
      rollNum >= range.minRoll && 
      rollNum <= range.maxRoll
    );
  } catch (error) {
    console.error("Error validating roll number:", error);
    return false;
  }
};
