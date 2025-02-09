import { SIZE_MAPPING, TSIZE_DAYS } from "@/constants/constants";

export const calculateMetrics = (selectedRows: any[]) => {
    const totalFeatures = selectedRows.length;

    const totalTSizeDays = selectedRows.reduce((total, row) => {
        try {
            const dbSize =
                (row
                    .getValue("t_size")
                    ?.toLowerCase() as keyof typeof SIZE_MAPPING) || "";
            console.log("Raw size:", dbSize); // Debug log

            if (!dbSize || !SIZE_MAPPING[dbSize]) {
                console.warn(`Invalid size value: ${dbSize}`);
                return total;
            }

            const mappedSize = SIZE_MAPPING[dbSize];
            console.log(
                "Mapped size:",
                mappedSize,
                "Days:",
                TSIZE_DAYS[mappedSize]
            ); // Debug log

            return total + TSIZE_DAYS[mappedSize];
        } catch (error) {
            console.error("Error calculating T-Size:", error);
            return total;
        }
    }, 0);

    return {
        totalFeatures,
        totalTSizeDays: totalTSizeDays || 0,
    };
};