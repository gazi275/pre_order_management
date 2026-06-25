"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🌱 Seeding database...");
        // Clear existing data
        yield prisma.preorder.deleteMany();
        const preorders = [
            {
                name: "Multi variant 3",
                products: 1,
                preorderWhen: "out-of-stock",
                startsAt: new Date("2025-12-15T20:24:00"),
                endsAt: null,
                status: "inactive",
            },
            {
                name: "Multi variant 2",
                products: 1,
                preorderWhen: "regardless-of-stock",
                startsAt: new Date("2025-12-15T20:24:00"),
                endsAt: new Date("2025-12-15T20:27:00"),
                status: "active",
            },
            {
                name: "Multi variants 1",
                products: 1,
                preorderWhen: "regardless-of-stock",
                startsAt: new Date("2025-12-15T20:24:00"),
                endsAt: null,
                status: "active",
            },
            {
                name: "Partial payment",
                products: 1,
                preorderWhen: "regardless-of-stock",
                startsAt: new Date("2025-08-17T16:56:00"),
                endsAt: null,
                status: "active",
            },
            {
                name: "Shipping not sure",
                products: 1,
                preorderWhen: "regardless-of-stock",
                startsAt: new Date("2025-08-17T16:56:00"),
                endsAt: null,
                status: "active",
            },
            {
                name: "Full payment",
                products: 1,
                preorderWhen: "regardless-of-stock",
                startsAt: new Date("2025-08-17T16:56:00"),
                endsAt: null,
                status: "active",
            },
            {
                name: "Coming soon",
                products: 1,
                preorderWhen: "regardless-of-stock",
                startsAt: new Date("2025-12-11T04:42:00"),
                endsAt: null,
                status: "active",
            },
            {
                name: "With ends",
                products: 1,
                preorderWhen: "regardless-of-stock",
                startsAt: new Date("2025-08-14T15:59:00"),
                endsAt: null,
                status: "active",
            },
        ];
        for (const preorder of preorders) {
            yield prisma.preorder.create({ data: preorder });
        }
        console.log(`✅ Seeded ${preorders.length} preorders`);
    });
}
main()
    .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
