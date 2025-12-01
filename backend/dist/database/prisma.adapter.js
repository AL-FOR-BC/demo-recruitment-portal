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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAdapter = void 0;
const prismadb_1 = __importDefault(require("../prismadb"));
class PrismaAdapter {
    constructor() {
        this.recruitment_user = {
            findUnique: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.users.findUnique({ where: args.where });
            }),
            create: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.users.create({ data: args.data });
            }),
            update: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.users.update({ where: args.where, data: args.data });
            }),
            updateById: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.users.update({ where: args.where, data: args.data });
            }),
            findById: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.users.findUnique({ where: args.where });
            }),
        };
        this.applicant_profile = {
            findUnique: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.applicant_profile.findUnique({ where: args.where });
            }),
            create: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.applicant_profile.create({ data: args.data });
            }),
            update: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.applicant_profile.update({
                    where: args.where,
                    data: args.data,
                });
            }),
        };
        this.bc_configs = {
            findUnique: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.bc_configs.findUnique({ where: args.where });
            }),
            findFirst: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.bc_configs.findFirst(args || {});
            }),
        };
        this.app_setup = {
            findFirst: () => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.app_setup.findFirst();
            }),
            create: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.app_setup.create({ data: args.data });
            }),
            update: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield prismadb_1.default.app_setup.update({
                    where: args.where,
                    data: args.data,
                });
            }),
        };
    }
    checkConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prismadb_1.default.$queryRaw `SELECT 1`;
                return true;
            }
            catch (error) {
                console.error("Prisma connection check failed:", error);
                return false;
            }
        });
    }
    queryRaw(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismadb_1.default.$queryRawUnsafe(query);
        });
    }
}
exports.PrismaAdapter = PrismaAdapter;
