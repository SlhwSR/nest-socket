import { AbilityBuilder, AbilityClass, PureAbility, subject } from '@casl/ability'
import { Subjects, createPrismaAbility, PrismaQuery } from '@casl/prisma'
import { Injectable } from '@nestjs/common'
import { Post, user } from '@prisma/client'

//验证能力定义：验证动作与模型
// type AppAbility = PrismaAbility<
//   [
//     string,
//     Subjects<{
//       Topic: Topic
//     }>,
//   ]
// >

// const AppAbility = PrismaAbility as AbilityClass<AppAbility>
type AppAbility = PureAbility<
  [
    string,
    Subjects<{
      User: user
      Post: Post
    }>,
  ],
  PrismaQuery
>
@Injectable()
export class CaslAbilityFactory {
  createForUser(user: user) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility)

    //参数说明：动作，实体类型|实体对象，验证条件
    //topic模型的更新验证，要求topic.userId为user.id时通过
    // can('update', 'Post', { userId: 10086 })

    return build()
  }
}
