import { Resolver, Query } from "type-graphql";
import { User } from "./type.js";
import { getAllUsers } from "../../lib/database/userModel.js";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users() {
    return await getAllUsers({});
  }
}
