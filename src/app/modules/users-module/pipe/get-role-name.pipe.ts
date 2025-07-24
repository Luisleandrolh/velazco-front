// get-role-name.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getRoleName',
})
export class GetRoleNamePipe implements PipeTransform {
  transform(roleId: string | number, roles: any[]): string {
    if (!roleId || !roles) return 'Sin rol';
    const role = roles.find((r) => r.id.toString() === roleId.toString());
    return role ? role.name : 'Rol no encontrado';
  }
}
